import * as AlertDialog from "@radix-ui/react-alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "确认",
  cancelText = "取消",
}: Props) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="admin-dialog-overlay" />
        <AlertDialog.Content className="hand-drawn-card admin-dialog-content admin-alert-content">
          <div className="admin-dialog-head">
            <AlertDialog.Title>{title}</AlertDialog.Title>
          </div>
          <AlertDialog.Description className="admin-dialog-desc">
            {description}
          </AlertDialog.Description>
          <div className="admin-dialog-actions">
            <AlertDialog.Cancel asChild>
              <button className="admin-secondary-btn" type="button">
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={onConfirm} type="button">
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default AdminConfirmDialog;
