const VideoModal = ({ isOpen, setOpen, id }) => {
  if (!isOpen) return null;

  return (
    <div
      className="video-modal-overlay"
      onClick={() => setOpen(false)}
    >
      <div
        className="video-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="video-modal-close"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <iframe
          width="100%"
          height="600"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title="Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;
