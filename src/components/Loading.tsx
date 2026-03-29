export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 surface-base flex flex-col items-center justify-center z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 200"
        width="300"
        height="120"
      >
        <style>{`
          .yarn-ball {
            animation: roll 2.5s ease-in-out infinite alternate;
          }
          .yarn-string {
            stroke-dasharray: 305;
            stroke-dashoffset: 305;
            animation: unravel 2.5s ease-in-out infinite alternate;
          }
          @keyframes roll {
            0% { transform: translate(100px, 120px) rotate(0deg); }
            100% { transform: translate(400px, 120px) rotate(360deg); }
          }
          @keyframes unravel {
            0% { stroke-dashoffset: 305; }
            100% { stroke-dashoffset: 0; }
          }
        `}</style>

        <ellipse cx="250" cy="165" rx="160" ry="6" fill="#ede9e7" />

        <path
          className="yarn-string"
          d="M 100 155 Q 250 162 400 155"
          fill="none"
          stroke="#f9a78d"
          stroke-width="4"
          stroke-linecap="round"
        />

        <g className="yarn-ball">
          <circle cx="0" cy="0" r="38" fill="#f9a78d" />

          <path
            d="M -25 -25 Q 0 -40 25 -25"
            fill="none"
            stroke="#AA654F"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M -35 -5 Q 0 -15 35 -5"
            fill="none"
            stroke="#AA654F"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M -38 10 Q 0 0 38 10"
            fill="none"
            stroke="#AA654F"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M -30 25 Q 0 15 30 25"
            fill="none"
            stroke="#AA654F"
            stroke-width="4"
            stroke-linecap="round"
          />

          <path
            d="M -15 -35 Q -30 0 -15 35"
            fill="none"
            stroke="#8D4D38"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M 0 -38 Q -15 0 0 38"
            fill="none"
            stroke="#8D4D38"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M 15 -35 Q 0 0 15 35"
            fill="none"
            stroke="#8D4D38"
            stroke-width="3"
            stroke-linecap="round"
          />

          <path
            d="M 0 38 Q 5 45 -5 45"
            fill="none"
            stroke="#8D4D38"
            stroke-width="4"
            stroke-linecap="round"
          />
        </g>
      </svg>

      <p className="text-label-md text-on-surface-variant mt-4">Cargando...</p>
    </div>
  );
}
