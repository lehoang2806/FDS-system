import { RejectCertificate } from "@/types/user";

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

interface RejectCertificateModalProps extends ModalCommonProps {
    selectedCertificate?: RejectCertificate | null;
}

interface CreateCampaignModalProps extends ModalCommonProps {}

interface RejectCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: RejectCampaign | null;
}

interface RejectReasonModalProps extends ModalCommonProps {
    reason: string;
}

interface RecipientCertificateModalProps extends ModalCommonProps {}