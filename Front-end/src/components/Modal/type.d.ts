import { CurrentCampaign } from "@/types/campaign";
import { currentOrganizationDonorCertificate, currentPersonalDonorCertificate, currentRecipientCertificate, RejectCertificate, ReviewCertificate } from "@/types/user";

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
    campaign: CurrentCampaign | null;
    registeredReceiver?: RegisteredReceiver[] | null;
}

interface AdditionalCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: AdditionalCampaign | null;
}

interface CancelCampaignModalProps extends ModalCommonProps {
    selectedCampaign?: CancelCampaign | null;
}

interface AdditionalCertificateModalProps extends ModalCommonProps {
    selectedCertificate?: ReviewCertificate | null;
}

interface UpdatePersonalDonorCertificateModalProps extends ModalCommonProps {
    selectedCurrentPersonalDonorCertificate?: currentPersonalDonorCertificate | null;
}

interface UpdateOrganizationDonorCertificateModalProps extends ModalCommonProps {
    selectedCurrentOrganizationDonorCertificate?: currentOrganizationDonorCertificate | null;
}

interface UpdateRecipientCertificateModalProps extends ModalCommonProps {
    selectedCurrentRecipientCertificate?: currentRecipientCertificate | null;
}

interface CreatePostModalProps extends ModalCommonProps {}

interface RejectPostModalProps extends ModalCommonProps {
    selectedRejectPost?: RejectPost | null;
}

interface CreateRequestSupportModalProps extends ModalCommonProps {}

interface RequestDonorModalProps extends ModalCommonProps {
    donorSupport?: DonorSupport[] | null;
    requestSupportId?: string | null;
}

interface RemindLoginModalProps extends ModalCommonProps {}

interface ListRegisterReceiverModalProps extends ModalCommonProps {
    registeredReceiver?: RegisterReceiver[] | null;
    implementTime: string;
}