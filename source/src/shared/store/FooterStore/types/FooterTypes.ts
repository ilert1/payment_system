export interface FooterData {
    buttonCaption?: string;
    nextPage?: string;
    showCancelBtn?: boolean;
    prevPage?: string;
    nextEnabled?: boolean;
    approve?: boolean;
    focused?: boolean;
    payeeCard?: boolean;
    noIcon?: boolean;
    buttonCallback?: () => void;
    hideRequisite?: boolean;
    isUnicalization: boolean;
}

export interface FooterStoreType extends FooterData {
    setFooter: (data: FooterData) => void;

    reset: () => void;
}
