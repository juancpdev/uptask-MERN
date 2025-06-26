import { addUserToProject } from '@/api/TeamAPI'
import { TeamMember } from '@/types/index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset} : SearchResultProps) {
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()
    
    const {mutate} = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.dismiss();
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.dismiss();
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAddUser = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

  return (
    <>
        <p className='font-bold'>Resultado:</p>
        <div className='flex justify-between items-center'>
            <p>{user.name}</p>
            <button 
                className='text-purple-600 font-bold cursor-pointer transition p-3 rounded  hover:bg-purple-100'
                onClick={handleAddUser}
            >
                Agregar
            </button>

        </div>
    </>
  )
}
