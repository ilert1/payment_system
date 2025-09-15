// export const CardNumberForms = () => {
//     return isEcom ? (
//         !isFetching && !waitTransfer ? (
//             <>
//                 <Heading size="l" title={t("enterYourCard", ns)} grow />
//                 <CardNumberForm disabled={isPressed || isFetching} cardHolderVisible={showCardHolder} />
//             </>
//         ) : (
//             <>
//                 <Heading size="l" title={t("getCard", ns)} grow />
//                 {(isPressed || isFetching) && <Loader />}
//             </>
//         )
//     ) : (
//         <>
//             <Heading size="l" title={`${t("enter4", ns)} ${isSbp ? t("yourPhone", ns) : t("yourCard", ns)}`} grow />
//             <CardNumberLast4 onComplete={onComplete} showHidden={!isSbp} />
//         </>
//     );
// };
