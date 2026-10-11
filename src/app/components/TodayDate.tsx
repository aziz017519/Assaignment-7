import { connection } from "next/server";

const TodayDate = async ({
  className = "block text-xs text-gray-500",
}: {
  className?: string;
}) => {
  await connection();

  const parts = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).formatToParts(new Date());

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {parts.map((part, index) =>
        part.type === "day" || part.type === "year" ? (
          <span key={index} className="font-notosans">
            {part.value}
          </span>
        ) : (
          part.value
        )
      )}
    </span>
  );
};

export default TodayDate;