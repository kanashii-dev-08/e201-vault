"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
	ownerId: string;
	accountId: string;
	className?: string;
}

export const FileUploader = ({ ownerId, accountId, className }: Props) => {
	const path = usePathname();
	const [files, setfiles] = useState<File[]>([]);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setfiles(acceptedFiles);

			const uploadPromises = acceptedFiles.map(async (file) => {
				if (file.size > MAX_FILE_SIZE) {
					setfiles((prevFiles) =>
						prevFiles.filter((f) => f.name !== file.name)
					);

					return toast.warning(
						<p className="body-2 text-black">
							<span className="font-semibold">{file.name}</span> is too large.
							Max file size is 50MB.
						</p>
					);
				}

				return uploadFile({ file, ownerId, accountId, path }).then(
					(uploadedFile) => {
						if (uploadedFile) {
							setfiles((prevFiles) =>
								prevFiles.filter((f) => f.name !== file.name)
							);
						}
					}
				);
			});
			await Promise.all(uploadPromises);
		},
		[ownerId, accountId, path]
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleRemoveFile = (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
		fileName: string
	) => {
		e.stopPropagation();
		setfiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
	};

	return (
		<div {...getRootProps()} className="cursor-pointer">
			<input {...getInputProps()} />
			<Button
				type="button"
				className={cn("primary-btn h-[52px] gap-2 px-10", className)}
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

								<Image
									src="/assets/icons/remove.svg"
									width={24}
									height={24}
									alt="Remove"
									onClick={(e) => handleRemoveFile(e, file.name)}
								/>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default FileUploader;
