import type { FileFragementFragment } from "@/gql/queries/entries/entryById2"
import {
    FileText,
    FileImage,
    Folder,
    Archive,
    File as FileFile,
    FileVideo,
} from "lucide-vue-next"
import type { Icon } from "@/types/types"

function isFolder(file: FileFragementFragment) {
    return file.fileType === "folder"
}

export function useFileIcon(file: FileFragementFragment): Icon {
    if (isFolder(file)) {
        return Folder
    }

    switch (file.MIMEType) {
        case "application/pdf":
            return FileText
        case "image/png":
            return FileImage
        case "image/jpeg":
            return FileImage
        case "image/gif":
            return FileImage
        case "image/webp":
            return FileImage
        case "image/jpg":
            return FileImage
        case "application/zip":
            return Archive
        case "video/mp4":
            return FileVideo
        default:
            return FileFile
    }
}

export function prettyBytes(bytes: number) {
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    if (Math.abs(bytes) < 1) {
        return bytes + "B"
    }

    const u = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1)
    const n = Number((bytes / Math.pow(1000, u)).toFixed(2))
    return `${n} ${units[u]}`
}