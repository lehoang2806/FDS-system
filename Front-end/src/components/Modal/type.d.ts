import { RejectCertificate, ReviewCertificate } from "@/types/user";

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

interface UpdateCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: CurrentCampaign | null;
}

interface RejectCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: RejectCampaign | null;
}

interface RejectReasonModalProps extends ModalCommonProps {
    reason?: string | null;
}

interface RecipientCertificateModalProps extends ModalCommonProps {}

interface RemindCertificateModalProps extends ModalCommonProps {}

interface RegisterReceiverModalProps extends ModalCommonProps {
    campaignId: string | undefined;
}

interface AdditionalCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: AdditionalCampaign | null;
}

interface AdditionalCertificateModalProps extends ModalCommonProps {
    selectedCertificate?: ReviewCertificate | null;
}