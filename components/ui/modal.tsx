"use client";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export function Modal({
                          open,
                          onClose,
                          children,
                      }: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                p-4
            "
            onClick={onClose}
        >
            <div
                className="
                    w-full max-w-lg
                    rounded-3xl
                    border border-zinc-200
                    bg-white
                    p-6
                    shadow-xl
                "
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}