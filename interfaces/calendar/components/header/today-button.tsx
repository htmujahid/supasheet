import { Button } from "@/components/ui/button";
import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <Button
      onClick={handleClick}
      size={"icon-lg"}
    >
      {today.getDate()}
    </Button>
  );
}
