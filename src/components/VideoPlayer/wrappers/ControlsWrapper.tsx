import React from 'react';

type ControlsWrapperPropsType = {
  children: React.ReactNode;
  className?: string;
};

export const ControlsWrapper: React.FC<ControlsWrapperPropsType> = ({children, className}) => {
	return (
		<div className={`absolute bottom-0 left-0 right-0 bg-black/50 p-2 ${className}`}>
			<div>{children}</div>
		</div>
	);
};
