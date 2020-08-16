import React, { useState, useEffect } from "react";
import "./Tooltip.scss";
import Portal from "HOC/Portal";
import PropTypes from "prop-types";

function Tooltip({ classes, children, anchorEl }) {
	const [showTooltip, setShowTooltip] = useState(false);
	const [cords, setCords] = useState({});
	let waitTimeBeforeRender = 0;

	useEffect(() => {
		const tooltipAnchorElement = anchorEl.current;
		const rect = anchorEl.current.getBoundingClientRect();
		setCords({
			left: rect.x - rect.width / 2,
			top: rect.y + window.scrollY + 30,
		});

		tooltipAnchorElement.addEventListener("mouseenter", showToolTip);
		tooltipAnchorElement.addEventListener("mouseleave", hideToolTip);

		return () => {
			if (waitTimeBeforeRender) clearTimeout(waitTimeBeforeRender);
			tooltipAnchorElement.removeEventListener("mouseenter", showToolTip);
			tooltipAnchorElement.removeEventListener("mouseleave", hideToolTip);
		};
	}, []);

	const showToolTip = () => {
		waitTimeBeforeRender = setTimeout(() => {
			setShowTooltip(true);
		}, 500);
	};

	const hideToolTip = () => {
    if (waitTimeBeforeRender) clearTimeout(waitTimeBeforeRender);
		setShowTooltip(false);
	};
	if (showTooltip) {
		return (
			<Portal mountTo="root-modal">
				<div
					style={{ top: cords.top, left: cords.left }}
					className={`tool-tip-wrapper ${classes.join(" ")}`}
				>
					{children}
				</div>
			</Portal>
		);
	} else {
		return null;
	}
}
Tooltip.defaultProps = {
	classes: [""],
};

Tooltip.propTypes = {
	classes: PropTypes.arrayOf(PropTypes.string),
	anchorEl: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]).isRequired,
	children: PropTypes.node.isRequired,
};

export default Tooltip;
