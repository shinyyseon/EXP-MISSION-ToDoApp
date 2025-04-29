// Element 생성
export const addEl = (
  tag,
  className = "",
  text = "",
  value = "",
  type = "",
  style = "",
  display = ""
) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.innerText = text;
  if (value) el.value = value;
  if (type) el.type = type;
  if (style) el.style = style;
  if (display) el.style.display = display;

  return el;
};