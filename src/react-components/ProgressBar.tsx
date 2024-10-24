import * as React from 'react'

export function ProgressBar(startValue) {
    
    const [progress, setProgress] = React.useState(startValue) //progress-bar of new project form states update

    return(
        <div className="field-container">
            <label className="field-title">
            <span className="material-icons-outlined form-icons">
                rotate_right
            </span>
            Progress
            </label>
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
                onChange={(e) => setProgress(Number(e.target.value))} //function that update the progress value in live
                style={{ width: "85%", height: 18 }}
            />
            <p style={{ marginRight: 10 }}>
                <output
                name="progress-output"
                className="progress-value"
                htmlFor="progress-bar"
                >
                {progress}
                </output>{" "}
                %
            </p>
            </div>
        </div>
    )
}