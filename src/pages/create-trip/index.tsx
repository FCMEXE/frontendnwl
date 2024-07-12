


import { FormEvent, useState } from "react" // import useState (innerHTML) manipulação de estados
import { useNavigate } from "react-router-dom"
import { InviteGuestModal } from "./invite-guest-modal"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { DestinationAndDataStep } from "./steps/destination-and-data-step"
import { InviteGuestSteps } from "./steps/invite-guests-steps"
import { DateRange } from "react-day-picker"
import { api } from "../../lib/axios"


export default function CreateTripPage() {

    const navigate = useNavigate()

    const [isGuestInputOPen, setIsGuestInputOPen] = useState(false) // estado
    const [isGuestModalOPen, setIsGuestModalOPen] = useState(false) // estado
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false) // estado
    const [emailsToInvite, setEmailsToInvite] = useState(['diego@teste.com.br', 'felipe@teste.com.br',]) // estado

    const [destination, setDestination] = useState("")
    const [ownerName, setOwnerName] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")
    const [eventStartAndDates, setEventStartAndDates] = useState<DateRange | undefined>()




    function openGuestInput() {
        setIsGuestInputOPen(true)
    } // retorna true 

    function closedGuestInput() {
        setIsGuestInputOPen(false)
    } // retorna false

    function openGuestModal() {
        setIsGuestModalOPen(true)
    }

    function closeGuestModal() {
        setIsGuestModalOPen(false)
    }

    function openConfirmTripModal() {
        setIsConfirmTripModalOpen(true)
    }

    function closeConfirmTripModal() {
        setIsConfirmTripModalOpen(false)
    }

    async function CreateTrip(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()


        if (!destination) {
            return
        }

        if (!eventStartAndDates?.from || !eventStartAndDates?.to) {
            return
        }

        if (setEmailsToInvite.length === 0) {
            return
        }

        if (!ownerName || !ownerEmail) {
            return
        }

        const response = await api.post('/trips', {
            destination,
            starts_at: eventStartAndDates?.from,
            ends_at: eventStartAndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail,
        })


        const { tripId } = response.data

        navigate(`/trips/${tripId}`)


        // navigate("/trips/123")
    }

    // adiciona email na lista 
    function atNewEmailToInvite(event: FormEvent<HTMLFormElement>) { // pega o evento do click
        event.preventDefault()// desabilita o evento padrao do form
        const data = new FormData(event.currentTarget) // pega o email pelo FormData
        const email = data.get('email')?.toString() // passa do data para uma const email

        if (!email) {
            return
        } // se ele nao enviar nada

        if (emailsToInvite.includes(email)) {
            return
        } // se o email ja existir

        setEmailsToInvite([
            ...emailsToInvite, email
        ]) // atualiza a lista

        event.currentTarget.reset() // reseta o input

    }

    // clicar no X do email, remove ele da lista
    function removeEmailsFromInvites(emailToRemove: string) {
        const newEmailList = emailsToInvite.filter(email => email !== emailToRemove) // filtra pelos email da lista 

        // atualiza a lista
        setEmailsToInvite(newEmailList)

    }
    return (
        // Logo e Titulo
        <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center ">
            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className="flex flex-col items-center  gap-3">
                    <img src="/logo.svg" alt="plann.er" />
                    {/* Primeiro Paragrafo */}
                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>

                <div className="space-y-4">
                    < DestinationAndDataStep
                        closedGuestInput={closedGuestInput}
                        isGuestInputOPen={isGuestInputOPen}
                        openGuestInput={openGuestInput}

                        setDestination={setDestination}
                        eventStartAndDates={eventStartAndDates}
                        setEventStartAndDates={setEventStartAndDates} />


                    {/* Segunda Tela apos o click do Botao*/}
                    {isGuestInputOPen && (
                        < InviteGuestSteps
                            emailsToInvite={emailsToInvite}
                            openConfirmTripModal={openConfirmTripModal}
                            openGuestModal={openGuestModal}
                        />

                    )}
                </div>
                <p className="text-sm text-zinc-500">
                    Ao planejar sua viagem pela plann.er voce automaticamente concorda <br />
                    com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">politicas de privacidade</a>.

                </p>
            </div>
            {isGuestModalOPen && (
                <InviteGuestModal
                    emailsToInvite={emailsToInvite}
                    atNewEmailToInvite={atNewEmailToInvite}
                    closeGuestModal={closeGuestModal}
                    removeEmailsFromInvites={removeEmailsFromInvites}
                />
            )}
            {isConfirmTripModalOpen && (
                <ConfirmTripModal
                    closeConfirmTripModal={closeConfirmTripModal}
                    CreateTrip={CreateTrip}
                    setOwnerEmail={setOwnerEmail}
                    setOwnerName={setOwnerName}
                />
            )}
        </div>

    )
}