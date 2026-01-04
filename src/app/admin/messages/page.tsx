'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Trash2, Check } from 'lucide-react'
import apiClient from '@/services/apiClient'
import { ContactMessage } from '@/types/contact'

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === 'unread') params.append('isRead', 'false')
      if (filter === 'read') params.append('isRead', 'true')

      const response = await apiClient.get<ContactMessage[]>(
        `/api/contact${params.toString() ? `?${params.toString()}` : ''}`
      )
      if (response.success && response.data) {
        setMessages(response.data)
      }
    } catch (error) {
      alert('Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.put(`/api/contact/${id}`)
      fetchMessages()
    } catch (error) {
      alert('Failed to mark as read')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await apiClient.delete(`/api/contact/${id}`)
      fetchMessages()
    } catch (error) {
      alert('Failed to delete message')
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading messages...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Manage contact messages</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No messages found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message._id} className={!message.isRead ? 'border-l-4 border-l-blue-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{message.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{message.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleString()
                        : 'Unknown date'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!message.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(message._id!)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(message._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

