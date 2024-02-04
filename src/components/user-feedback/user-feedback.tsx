import { zodResolver } from '@hookform/resolvers/zod';
import { useClickOutside } from '@src/hooks';
import { cn, EMAIL_REGEX } from '@src/utils';
import { MessageSquarePlus, X } from 'lucide-react';
import { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@src/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@src/components/ui/form';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Textarea } from '@src/components/ui/textarea';
import { MESSAGE } from '@src/constants/message';

interface IProps {
	disabled?: boolean;
	allowImage?: boolean;
	feedbackTypes?: Array<{ label: string; value: string }>;
	onSubmit: (values, onError) => void;
	timeout?: number;
}

const UserFeedback: FC<IProps> = (props) => {
	const {
		disabled,
		feedbackTypes = [
			{ value: 'general', label: 'General' },
			{ value: 'bug', label: 'Bug' },
			{ value: 'idea', label: 'Idea' },
		],
		allowImage,
		onSubmit,
		timeout = 3000,
	} = props;

	const menuRef = useRef(null);

	const [open, setOpen] = useState(false);
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<any>(false);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [type, setType] = useState<string>(feedbackTypes[0].value);
	const [image, setImage] = useState<any>(null);

	const formSchema = z.object({
		email: z
			.string()
			.max(255, {
				message: MESSAGE.TOO_LONG,
			})
			.optional()
			.refine(
				(value: string | undefined) => {
					return !value || EMAIL_REGEX.test(value);
				},
				{
					message: MESSAGE.INVALID_EMAIL,
				},
			),
		message: z.string(),
		type: z.string(),
	});

	type FormValues = z.infer<typeof formSchema>;

	const defaultValues: Partial<FormValues> = {
		email: '',
		message: '',
		type: feedbackTypes.length ? feedbackTypes[0].value : '',
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange',
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (form.formState.isDirty) {
			onSubmit({ ...values, image, type }, onSubmitError);
			onSubmitSuccess();
		}
	};

	useClickOutside(menuRef, () => setOpen(false));

	const toggle = () => {
		if (open) {
			close();
		} else {
			setOpen(!open);
		}
	};

	const close = () => {
		setOpen(false);
		resetFormState();
	};

	const selectType = (value) => () => {
		setType(value);
	};

	const resetFormState = () => {
		form.reset();
		setError(false);
		setSending(false);
		setSent(false);
		setImage(null);
	};

	const onSubmitSuccess = () => {
		setSending(false);
		setSent(true);
		setError(false);
		setTimeout(() => {
			setSent(false);
		}, timeout);
	};

	const onSubmitError = (error: any) => {
		setSending(false);
		setError(determineErrorType(error?.response));
		setTimeout(() => {
			setError(false);
		}, timeout);
	};

	const determineErrorType = (err) => {
		if (!err) return 'Unexpected';

		if (typeof err === 'string') return err;

		switch (err?.status) {
			case 400:
				return 'Bad request';
			case 403:
				return 'Forbidden';
			case 404:
				return 'Not found';
			case 410:
				return 'Archived';
			case 500:
				return 'Internal Server Error';
			default:
				return 'Unexpected';
		}
	};

	const attachImage = (event) => {
		const { files } = event.target;

		const file = files[0];
		file.preview = window.URL.createObjectURL(file);
		setUploadingImage(true);
		setImage(file);
		setUploadingImage(false);
	};

	const RenderImage = () => {
		return (
			<FormItem className="mb-3	relative">
				<FormLabel>Attach Image</FormLabel>
				{image?.preview ? (
					RenderPreview()
				) : (
					<Input
						className="bg-background"
						type="file"
						id="imageUpload"
						accept="image/*"
						onChange={attachImage}
					/>
				)}
			</FormItem>
		);
	};

	const removeImage = (event) => {
		if (event) event.preventDefault();
		setImage(null);
		setUploadingImage(false);
	};

	const RenderPreview = () => {
		if (!image?.preview) return null;

		return (
			<div
				className="hover:bg-blend-darken flex rounded-md bg-cover bg-center relative w-full h-[140px] mt-3"
				style={{
					backgroundImage: `url(${image?.preview})`,
				}}
			>
				{uploadingImage ? (
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
						<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
							Loading...
						</span>
					</div>
				) : (
					<div className="absolute top-0 right-0 bottom-0 left-0 text-center opacity-0 hover:opacity-100">
						<span
							className="absolute absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-[12px] uppercase text-red-600 cursor-pointer hover:bg-blend-overlay"
							onClick={removeImage}
						>
							Remove
						</span>
					</div>
				)}
			</div>
		);
	};

	// Return nothing if the component has been disabled
	if (disabled) return null;

	let submitLabel = 'Submit';

	if (sent) submitLabel = 'Sent';
	if (sending && !sent) submitLabel = 'Sending';
	if (error) submitLabel = error;

	return (
		<div
			ref={menuRef}
			className={cn(
				'fixed z-[99999998] bottom-[12px] right-0 m-[1em] text-left font-[400]',
			)}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div
						className={cn(
							'hidden bg-[#f4f4f7] relative z-[999999999] rounded-[4px] w-[380px] bottom-[65px] right-0 shadow-[0_6px_30px_2px_rgba(34,44,79,0.3)] [animationFadeOutDown]',
							open && 'block',
						)}
					>
						<div className="flex text-white	bg-primary py-3 px-4 rounded-t-[3px] text-[14px] items-center">
							<MessageSquarePlus className="mr-1.5" />
							<span>Feedback</span>
							<button
								className="cursor-pointer opacity-70 text-white ml-auto text-[11px] hover:opacity-100"
								onClick={close}
							>
								<X width={'16px'} />
							</button>
						</div>

						<div className="p-3">
							<FormField
								control={form.control}
								name="email"
								key="email"
								render={({ field }) => (
									<FormItem className="mb-3	relative">
										<Label>Email</Label>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormItem className="mb-3 relative">
								<Label>Feedback Type</Label>
								<ul className="flex list-none p-0 m-0 mb-[0.85em]">
									{feedbackTypes?.map((item) => (
										<li
											key={item.value}
											className={cn(
												'w-full bg-background select-none text-center p-3 text-[13px] cursor-pointer whitespace-nowrap overflow-hidden truncate first-of-type:rounded-l-md first-of-type:-mr-[1px] last-of-type:rounded-r-md last-of-type:-ml-[1px] border border-[#d0d8e1]',
												type === item.value &&
													'bg-primary text-white border-primary',
											)}
											title={item.label}
											onClick={selectType(item.value)}
										>
											{item.label}
										</li>
									))}
								</ul>
								<FormMessage />
							</FormItem>

							<FormField
								control={form.control}
								name="message"
								key="message"
								render={({ field }) => (
									<FormItem className="mb-3	relative">
										<Label>Feedback Message</Label>
										<FormControl>
											<Textarea
												id="message"
												placeholder="Enter your feedback!"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Only render the image upload if there's callback available  */}
							{allowImage && RenderImage()}

							<Button
								type="submit"
								disabled={
									sending ||
									!form.formState.isDirty ||
									form.formState.isLoading ||
									form.formState.isSubmitting ||
									form.formState.isValidating
								}
								variant={error ? 'destructive' : 'default'}
								className={cn(
									'w-full mt-3 uppercase',
									sent && 'bg-green-600 hover:bg-green-700',
								)}
							>
								{submitLabel}
							</Button>
						</div>
					</div>

					<Button
						className={cn(
							'flex items-center absolute right-0 bottom-0 whitespace-nowrap cursor-pointer transition hover:shadow-[0_6px_16px_2px_rgba(0,0,0,0.2)] [hover:transform:translateY(-1px)]',
						)}
						onClick={toggle}
					>
						{!open ? <MessageSquarePlus /> : <X />}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default UserFeedback;
