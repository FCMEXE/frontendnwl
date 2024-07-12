import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns"
import "react-day-picker/dist/style.css"

interface DestinationAndDataStep {
    isGuestInputOPen: boolean
    closedGuestInput: () => void
    eventStartAndDates: DateRange | undefined
    openGuestInput: () => void
    setDestination: (destination: string) => void
    setEventStartAndDates: (dates: DateRange | undefined) => void
}


export function DestinationAndDataStep({
    isGuestInputOPen,
    closedGuestInput,
    openGuestInput,
    setDestination,
    setEventStartAndDates,
    eventStartAndDates
}: DestinationAndDataStep) {

    const [isDataPickerOpen, setisDataPickerOpen] = useState(false)



    function openDataPicker() {
        return setisDataPickerOpen(true)
    }

    function closeDataPicker() {
        return setisDataPickerOpen(false)
    }

    const displayedData = eventStartAndDates && eventStartAndDates.from && eventStartAndDates.to ?
        format(eventStartAndDates.from, 'd').concat(' até ').concat(format(eventStartAndDates.to, "d  'de' LLL  "))
        : null


    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className="flex itens-center gap-2 flex-1">
                <MapPin className="size-5 text-zinc-400" />
                <input disabled={isGuestInputOPen} type="text"
                    placeholder="Para onde voce vai?"
                    className="bg-transparent text-lg placeholder: text-zinc-400 outline-none flex-1" onChange={event => setDestination(event.target.value)} />
            </div>

            {/* Segundo Input (Quando) */}
            <button onClick={openDataPicker} disabled={isGuestInputOPen} className="flex items-center gap-2 text-left w-[248px]">
                <Calendar className="size-5 text-zinc-400" />
                <span
                    className="text-lg text-zinc-400 w-40 ">
                    {displayedData || "Quando"}
                </span>

            </button>

            {/* MOdal Data */}
            {isDataPickerOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className=" rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                        <div className="space-y-2">
                            <div className="flex itens-center justify-between">

                                <h2 className="text-lg font-semibold">Selecione a data</h2>
                                <button type="button" onClick={closeDataPicker}>
                                    <X className="size-5 text-zinc-400" />
                                </button>
                            </div>
                        </div>

                        <DayPicker mode="range" selected={eventStartAndDates} onSelect={setEventStartAndDates} />

                    </div>
                </div>
            )}


            {/* Barrinha entre o "Quando e button Continuar" */}
            <div className=" w-px h-6 bg-zinc-800" />


            {/* manipula o estado, ao clicar no botao faz o isGuestInputOPen se tornar true, fazendo um if se isGuestInputOPen for true mostra os 2 outros inputs */}
            {/* Validação do If ternario -> */}
            {isGuestInputOPen ? (
                // ao clicar nesse button, retorna para a primeira pagina, pois isGuestInputOPen volta a ser false

                <Button onClick={closedGuestInput} variant="secondary">
                    Alterar local/data
                    <Settings2 className="size-5" />
                </Button>

            ) : (
                <Button onClick={openGuestInput} variant="primary">
                    Continuar
                    <ArrowRight className="size-5" />
                </Button>
            )}
        </div>
    )

}