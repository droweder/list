import React, { useState } from 'react';
import Header from '../ui/Header';
import { Member } from '../../types';

interface InviteScreenProps {
    listName: string;
    members: Member[];
    onInvite: (email: string) => void;
    onDeleteMember: (memberId: string) => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ listName, members, onInvite, onDeleteMember }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onInvite(email.trim());
            setEmail('');
        }
    }

  return (
    <div>
      <Header title="Convidar para a Lista" />
       <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Compartilhe sua lista "{listName}"!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Convide amigos ou familiares para colaborar na sua lista de compras em tempo real.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail do convidado"
                        required
                        className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Enviar Convite
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">Membros Atuais</h2>
                 <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {members.map(member => (
                        <li key={member.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{member.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                            </div>
                            {member.id !== '1' && ( // Don't allow deleting the main user
                                <button onClick={() => onDeleteMember(member.id)} className="p-1 text-red-500 hover:text-red-700">
                                    <TrashIcon />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
       </div>
    </div>
  );
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export default InviteScreen;