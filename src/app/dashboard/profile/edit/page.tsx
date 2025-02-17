import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import EditProfileForm from '@/components/EditProfileForm'

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    redirect('/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className='p-8'>
      <EditProfileForm
        currentName={user.name}
        currentImageUrl={user.imageUrl}
      />
    </div>
  )
}
