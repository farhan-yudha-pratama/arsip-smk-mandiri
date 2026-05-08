<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use App\Models\Document;

class DocumentGenerationFailedNotification extends Notification
{
    use Queueable;

    protected $document;
    protected $error;

    /**
     * Create a new notification instance.
     */
    public function __construct(Document $document, string $error)
    {
        $this->document = $document;
        $this->error = $error;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->error()
                    ->subject('Document Generation Failed')
                    ->line('The generation of document "' . $this->document->title . '" has failed.')
                    ->line('Error: ' . $this->error)
                    ->action('View Documents', url('/documents'))
                    ->line('Please try again or contact support.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'document_id' => $this->document->id,
            'title' => $this->document->title,
            'error' => $this->error,
            'message' => 'Document generation failed: ' . $this->document->title,
        ];
    }
}
