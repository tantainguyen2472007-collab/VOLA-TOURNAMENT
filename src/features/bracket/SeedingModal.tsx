import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { X, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { TournamentTeam } from "./engine";

interface SeedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeams: TournamentTeam[];
  onGenerate: (teams: TournamentTeam[]) => void;
}

export function SeedingModal({ isOpen, onClose, initialTeams, onGenerate }: SeedingModalProps) {
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTeams(initialTeams.map(t => ({...t})));
    }
  }, [isOpen, initialTeams]);

  if (!isOpen) return null;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(teams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTeams(items);
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    setTeams([...teams, { 
      id: `team-${Date.now()}`, 
      name: newTeamName.trim() 
    }]);
    setNewTeamName("");
  };

  const handleRemoveTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div>
            <h2 className="text-2xl font-display text-white tracking-widest uppercase">Cấu hình Đội tuyển</h2>
            <p className="text-white/40 text-xs tracking-widest font-bold uppercase mt-1">Kéo thả để sắp xếp hạt giống (1 đến {teams.length})</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleAddTeam} className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Nhập tên đội mới..." 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-display tracking-widest uppercase focus:outline-none focus:border-accent"
            />
            <button 
              type="submit"
              disabled={!newTeamName.trim()}
              className="px-6 py-3 bg-white/10 text-white font-display tracking-widest text-sm rounded-xl hover:bg-white/20 transition-colors uppercase disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm Đội
            </button>
          </form>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="teams-list">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="flex flex-col gap-3"
                >
                  {teams.map((team, index) => (
                    <Draggable key={team.id} draggableId={team.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex items-center gap-4 bg-white/5 border rounded-xl p-4 transition-colors",
                            snapshot.isDragging ? "border-accent shadow-[0_0_20px_rgba(234,179,8,0.2)] bg-accent/5 z-50" : "border-white/5 hover:border-white/20"
                          )}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="p-2 text-white/20 hover:text-white cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-display tracking-widest text-white/60">
                            #{index + 1}
                          </div>
                          
                          <div className="flex-1 font-display tracking-widest text-lg uppercase">
                            {team.name}
                          </div>
                          
                          <button 
                            onClick={() => handleRemoveTeam(team.id)}
                            className="p-2 text-danger/50 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white/5 text-white/60 font-display tracking-widest text-sm rounded-full hover:bg-white/10 hover:text-white transition-colors uppercase border border-white/5"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => onGenerate(teams)}
            disabled={teams.length < 2}
            className="px-8 py-3 bg-accent text-black font-display tracking-widest text-sm rounded-full hover:bg-yellow-400 transition-colors uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50"
          >
            Tạo Bracket ({teams.length} Đội)
          </button>
        </div>
      </div>
    </div>
  );
}
