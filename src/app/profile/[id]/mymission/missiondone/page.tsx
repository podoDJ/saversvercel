import supabase from "@/libs/supabase";
import { convertDate } from "@/libs/util";
import { ListMission } from "@/types/types";
import React from "react";

// export const revalidate = 0;

const MissionDone = async ({ params }: { params: { id: string } }) => {
  const currentDate = convertDate(new Date());
  const searchId = decodeURIComponent(params.id);
  let { data: dailyMission, error } = await supabase

  .from("missionList")
  .select("*")
  .eq("userId", searchId)
  .eq("doingYn", false)
  if (error) {
    console.log("데이터가져올 때 에러남");
    return false;
  }
if (dailyMission!.length === 0) return (
  <div>지금까지 완료한 미션이 없네요!!</div>
)

  return (
    <div className="bg-green-200 h-full justify-center items-center gap-x-16 text-white">
      {dailyMission!.map((mission: ListMission) => {
        return (
          <div className="bg-slate-500 mb-5" key={mission.id}>
            <p>{mission.id}</p>
            <p>미션 제목 : {mission.title}</p>
            <p>미션 내용 : {mission.content}</p>
            <p>미션 생성일 : {mission.createdAt}</p>
            <p>미션 수행중인가요? : {mission.doingYn.toString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MissionDone;
