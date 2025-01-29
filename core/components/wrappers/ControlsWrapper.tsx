import React from 'react';

type ControlsWrapperPropsType = {
	children: React.ReactNode;
	className?: string;
};

export const ControlsWrapper: React.FC<ControlsWrapperPropsType> = ({ children, className }) => {
	return (
		<div className={`tvp-absolute tvp-bottom-0 tvp-left-0 tvp-right-0 tvp-bg-black/50 tvp-p-2 ${className}`}>
			<div>{children}</div>
		</div>
	);
};
