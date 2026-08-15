import { useParams } from "react-router-dom";
import { useMapVeto } from "../../features/map-veto/useMapVeto";
export function ScoreboardOverlayPage(){const {roomId}=useParams<{roomId:string}>();const {state}=useMapVeto(roomId,"viewer");return <div className="score-overlay"><strong>TEAM A</strong><span>{state?.status==="completed"?"VETO LOCKED":"BO3 MAP VETO"}</span><strong>TEAM B</strong></div>}
