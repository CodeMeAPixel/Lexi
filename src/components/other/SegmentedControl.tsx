import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  createRef,
  RefObject,
  useCallback,
} from "react";

type Segment = {
  value: string;
  label: string;
  ref?: RefObject<HTMLDivElement | null>;
};
type Props = {
  name: string;
  segments: Segment[];
  callback: (value: string, index: number) => void;
  defaultIndex?: number;
  controlRef?: RefObject<HTMLDivElement | null>;
};

export default function SegmentedControl({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const containerRef = controlRef ?? useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Ensure refs for each segment
  const segmentRefs = useRef<RefObject<HTMLDivElement | null>[]>([]);
  if (segmentRefs.current.length !== segments.length) {
    segmentRefs.current = segments.map(
      (_, i) => segments[i].ref || createRef<HTMLDivElement | null>(),
    );
  }

  const updateHighlight = useCallback(() => {
    const el = segmentRefs.current[activeIndex]?.current;
    const container = containerRef.current;
    const hl = highlightRef.current;
    if (!el || !container || !hl) return;

    const segRect = el.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const left = segRect.left - contRect.left + container.scrollLeft;

    hl.style.transform = `translateX(${left}px)`;
    hl.style.width = `${segRect.width}px`;
  }, [activeIndex]);

  // Use layout effect so highlight moves before paint
  useLayoutEffect(() => {
    updateHighlight();
  }, [activeIndex, updateHighlight, segments.length]);

  const onInputChange = (value: string, index: number) => {
    setActiveIndex(index);
    callback(value, index);
  };

  return (
    <div
      className="controls-container"
      ref={containerRef}
      role="radiogroup"
      aria-label={name}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % segments.length);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + segments.length) % segments.length);
        }
      }}
    >
      <div className="controls">
        <div
          ref={highlightRef}
          className="controls-highlight"
          aria-hidden="true"
        />
        {segments.map((item, i) => (
          <div
            key={item.value}
            className={`segment ${i === activeIndex ? "active" : "inactive"}`}
            ref={segmentRefs.current[i]}
          >
            <input
              type="radio"
              value={item.value}
              id={`${name}-${item.label}-${i}`}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
              aria-checked={i === activeIndex}
              tabIndex={i === activeIndex ? 0 : -1}
            />
            <label htmlFor={`${name}-${item.label}-${i}`}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
