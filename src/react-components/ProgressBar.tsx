import * as React from 'react'

interface Props {
    startValue: number
    onProgressChange?: (value: number) => void; // Callback prop
}

export function ProgressBar(props:Props) {
    
    const [progress, setProgress] = React.useState(props.startValue) //progress-bar of new project form states update
  
    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setProgress(newValue);
        if (props.onProgressChange) {
          props.onProgressChange(newValue); // Notify parent of change
        }
      };
    
    return(
        <div className="field-container">
            <bim-label class='bim-label-form' icon='ion:hourglass-outline'>Progress</bim-label>
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}
            >
            <input
                className="progress-bar"
                name="progress"
                type="range"
                min={0}
                max={100}
                value={progress} //react value for update the progress value
                onChange={handleProgressChange} //function that update the progress value in live
                style={{ width: "85%", height: 18 }}
            />
            <bim-label name='progress' value={progress} class='bim-label-form' style={{ marginRight: 10 }}>
                {progress}
            </bim-label>
            %
            </div>
        </div>
    )
}