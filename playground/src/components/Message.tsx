interface MessageProps {
  message: {
    text: string;
    success: boolean;
  } | null;
}

export default function Message({ message }: MessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={`mt-4 p-4 rounded ${message.success ? 'bg-green-200' : 'bg-red-200'}`}>
      <p>{message.text}</p>
    </div>
  );
}
