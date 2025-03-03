"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";

interface Props {
	ownerId: string;
	accountId: string;
	className?: string;
}

export const FileUploader = ({ ownerId, accountId, className }: Props) => {
	const [files, setfiles] = useState<File[]>([]);
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setfiles(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} className="cursor-pointer">
			<input {...getInputProps()} />
			<Button
				type="button"
				className={cn(
					"primary-btn h-[52px] gap-2 px-10 shadow-drop-1",
					className
				)}
			>
				<Image
					src="/assets/icons/upload.svg"
					alt="upload"
					width={24}
					height={24}
				/>
				<p>Upload</p>
			</Button>
			{files.length > 0 && (
				<ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-screen-xs flex-col gap-3 rounded-[20px] bg-white p-7">
					<h4 className="h4 text-light-100">Uploading</h4>
					{files.map((file, index) => {
						const { type, extension } = getFileType(file.name);

						return (
							<li
								key={`${file.name}-${index}`}
								className=" flex items-center justify-between  gap-3 rounded-xl p-3"
							>
								<div className="flex items-center gap-3">
									<Thumbnail
										type={type}
										extension={extension}
										url={convertFileToUrl(file)}
									/>

									<div className="preview-item-name">
										{file.name}
										<Image
											src="/assets/icons/file-loader.gif"
											width={80}
											height={26}
											alt="Loader"
										/>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			)}
			{isDragActive ? (
				<p>Drop the files here ...</p>
			) : (
				<p>Drag &apos;n&apos; drop some files here, or click to select files</p>
			)}
		</div>
	);
};

export default FileUploader;
