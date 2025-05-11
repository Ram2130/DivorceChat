interface InterestTagProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

const InterestTag = ({ name, selected, onClick }: InterestTagProps) => {
  return (
    <div 
      className={`interest-tag ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default InterestTag;
