// import { useContext } from "react";
// import AppContext from "../AppContext";

// export const Rating = ({ rate, setRate }) => {
//     const { t } = useContext(AppContext);
//     //translation
//     const ns = { ns: "Rating" };

//     const onClick = index => {
//         setRate(index);
//     };

//     const getStars = () => {
//         let stars = [];
//         for (let i = 0; i < 5; i++) {
//             stars.push(
//                 <button
//                     key={`star${i}`}
//                     className={`star${rate > i ? " active" : ""}`}
//                     onClick={() => {
//                         onClick(i + 1);
//                     }}></button>
//             );
//         }
//         return stars;
//     };

//     return (
//         <div className="rating-container">
//             <p>{t("question", ns)}</p>
//             <div className="stars-container">{getStars()}</div>
//         </div>
//     );
// };

// export default Rating;
