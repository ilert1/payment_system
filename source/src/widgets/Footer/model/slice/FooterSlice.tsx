import { create } from "zustand";

export const useFooterStore = create<FooterStoreType>(set => ({
    isFetching: false,
    approve: false,
    focused: false,
    payeeCard: false,
    noIcon: false,
    buttonCallback: () => {},
    hideRequisite: false,
    isUnicalization: false,
    buttonCaption: "",
    nextPage: "",
    showCancelBtn: false,
    prevPage: "",
    nextEnabled: false,

    setFooter: (data: FooterStoreType) => set(state => ({ ...state, ...data })),

    reset: () =>
        set({
            buttonCaption: "",
            nextPage: "",
            showCancelBtn: false,
            prevPage: "",
            nextEnabled: false,
            approve: false,
            focused: false,
            payeeCard: false,
            noIcon: false,
            buttonCallback: () => {},
            hideRequisite: false,
            isUnicalization: false
        })
}));
