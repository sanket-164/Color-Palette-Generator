type Props = {
  title: string;
  description?: string;
};

const EmptyState = ({ title, description }: Props) => {
  return (
    <div className="py-10 text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {title}
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {description}
      </h2>
    </div>
  );
};

export default EmptyState;
