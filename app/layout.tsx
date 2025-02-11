import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "E201 Vault",
	description:
		"E201 Vault is a secure and efficient document management system designed for storing, uploading, downloading, and sharing e201 employee files. Built with modern web technologies, it ensures easy access, organization, and compliance for HR departments and organizations handling confidential employee records.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} font-poppins antialiased`}>
				{children}
			</body>
		</html>
	);
}
