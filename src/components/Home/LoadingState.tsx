import LoadingAnimation from '../common/LoadingAnimation';

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingAnimation />
    </div>
  );
}