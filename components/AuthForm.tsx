"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "@/components/OTPModal";

type FormType = "sign-in" | "sign-up";

// Define validation schema dynamically based on the form type
const authFormSchema = (formType: FormType) => {
	return z.object({
		email: z.string().email(),
		fullName:
			formType === "sign-up"
				? z.string().min(2).max(50)
				: z.string().optional(),
	});
};

const AuthForm = ({ type }: { type: FormType }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [accountId, setAccountId] = useState(null);
	const formSchema = authFormSchema(type);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
		},
		shouldUnregister: true, // Ensures fields are removed when switching between sign-in and sign-up
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const user =
				type === "sign-up"
					? await createAccount({
							fullName: values.fullName || "",
							email: values.email,
						})
					: await signInUser({ email: values.email });

			setAccountId(user.accountId);
		} catch {
			setErrorMessage("Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
					<h1 className="form-title">
						{type === "sign-up" ? "Sign Up" : "Sign In"}
					</h1>
					{type === "sign-up" && (
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter your email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="form-submit-button"
						disabled={isLoading}
					>
						{type === "sign-up" ? "Sign Up" : "Sign In"}
						{isLoading && (
							<Image
								src="/assets/icons/loader.svg"
								alt="loading"
								width={24}
								height={24}
								className="ml-2 animate-spin"
							/>
						)}
					</Button>
					{errorMessage && <p>{errorMessage}</p>}
					<div className="body-2 flex justify-center">
						<p className="text-dark-100">
							{type === "sign-in"
								? "Don't have an account?"
								: "Already have an account?"}
						</p>
						<Link
							href={type === "sign-in" ? "/sign-up" : "/sign-in"}
							className="ml-1 font-medium text-brand"
						>
							{" "}
							{type === "sign-in" ? "Sign Up" : "Sign In"}
						</Link>
					</div>
				</form>
			</Form>

			{accountId && (
				<OTPModal email={form.getValues("email")} accountId={accountId} />
			)}
		</>
	);
};

export default AuthForm;
