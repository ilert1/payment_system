import React from "react";

// export default function SvgrMock(props: React.SVGProps<SVGSVGElement>) {
//     return <svg {...props} />;
// }

const SvgMock = ({ "data-testid": testId, ...props }: React.SVGProps<SVGSVGElement> & { "data-testid": string }) => (
    <svg data-testid={testId || "svg-icon"} {...props} />
);

export default SvgMock;
