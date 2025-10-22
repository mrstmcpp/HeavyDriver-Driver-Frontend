import { useEffect, useRef } from "react";

const CustomMarker = ({ map, position, label, iconUrl, color, zIndex = 1 }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !position || !window.google || !window.google.maps) return;

    let AdvancedMarker;
    let marker;

    async function createMarker() {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      AdvancedMarker = AdvancedMarkerElement;

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";

      const labelEl = document.createElement("div");
      labelEl.textContent = label;
      labelEl.style.background = color;
      labelEl.style.color = "white";
      labelEl.style.padding = "2px 8px";
      labelEl.style.borderRadius = "10px";
      labelEl.style.fontWeight = "600";
      labelEl.style.fontSize = "12px";
      labelEl.style.marginBottom = "4px";
      labelEl.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      labelEl.style.whiteSpace = "nowrap";

      const icon = document.createElement("img");
      icon.src = iconUrl;
      icon.width = 36;
      icon.height = 36;
      icon.style.display = "block";
      icon.style.userSelect = "none";
      icon.style.pointerEvents = "none";

      wrapper.appendChild(labelEl);
      wrapper.appendChild(icon);

      marker = new AdvancedMarker({
        map,
        position,
        content: wrapper,
        zIndex,
      });

      markerRef.current = marker;
    }

    createMarker();

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, position, label, iconUrl, color, zIndex]);

  return null;
};

export default CustomMarker;
