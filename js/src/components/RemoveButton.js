import React from "react";

const defaultClickHandler = e => {
  e.preventDefault();
};

export default function(props) {
  const clickHandler = props.onClick || defaultClickHandler;

  return (
    <button
      type="button"
      className="addressfield-geosuggest__remove"
      onClick={clickHandler}
    >
      <svg
        height="16px"
        data-prefix="fas"
        data-icon="minus"
        class="svg-inline--fa fa-minus fa-w-14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <title id={props.title_id}>{props.title}</title>
        <path
          fill="currentColor"
          d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
        />
      </svg>
    </button>
  );
}
