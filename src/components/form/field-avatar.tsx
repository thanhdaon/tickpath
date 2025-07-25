import { Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadProps,
} from "~/components/ui/file-upload";
import { useFieldContext } from "./context";

export default function FieldAvatar() {
  const field = useFieldContext<File | undefined>();

  const fileUploadProps: FileUploadProps = {
    value: field.state.value ? [field.state.value] : [],
    onValueChange(files) {
      field.handleChange(files[0] ?? undefined);
    },
    disabled: field.state.value !== undefined,
    accept: "image/*",
    className: "flex flex-row gap-2",
    maxSize: 200 * 1024,
    maxFiles: 1,
  };

  return (
    <FileUpload {...fileUploadProps}>
      {field.state.value && (
        <FileUploadList>
          <FileUploadItem value={field.state.value} className="p-0">
            <FileUploadItemPreview className="size-20" />
            <FileUploadItemDelete asChild>
              <Button
                variant="secondary"
                size="icon"
                className="-top-1 -right-1 absolute size-5 rounded-full"
              >
                <X className="size-3" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </FileUploadList>
      )}
      <FileUploadDropzone className="p-2 cursor-pointer flex-grow">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-4 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Put your avatar here</p>
        </div>
      </FileUploadDropzone>
    </FileUpload>
  );
}
