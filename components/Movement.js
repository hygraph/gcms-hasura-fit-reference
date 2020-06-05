const Movement = ({ movement }) => {
  const isSeconds = movement.duration && movement.duration < 60 ? true : false;
  return (
    <div className="w-full flex border-b last-child:border-none border-woodsmoke-400">
      <div className="w-8/12 text-gray-200 py-2 px-4 flex-grow-0 items-center">
        <p>{movement.title}</p>
      </div>
      <div className="w-4/12 text-gray-200 py-2 px-4 flex-grow-0 items-center flex">
        <p>
          {movement.duration
            ? `${movement.duration / (isSeconds ? 1 : 60)} ${
                isSeconds ? "Seconds" : "Minutes"
              }`
            : movement.repetition
            ? `x ${movement.repetition}`
            : `AMRAP`}
        </p>
      </div>
    </div>
  );
};

export default Movement;
