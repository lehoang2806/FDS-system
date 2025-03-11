interface ModalProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    title?: string;
    children: React.ReactNode;
}

interface ModalCommonProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
}

interface SubmitCertificateModalProps extends ModalCommonProps {}

interface PersonalDonorModalProps extends ModalCommonProps {}

interface OrganizationDonorModalProps extends ModalCommonProps {}