import { get, groupBy } from "lodash";

const fullWidthStyle = {
  width: "100%",
  height: "auto"
};

const formatDate = dateString => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  const month = date.getMonth();
  const year = date.getUTCFullYear();
  return `${months[month]} ${year}`;
};

const renderSemester = (semester, semesterId) => {
  const subjectRows = semester.map((s, i) => (
    <tr key={i}>
      <td>{s.name}</td>
      <td>{s.courseCredit}</td>
      <td>{s.grade}</td>
    </tr>
  ));
  const sem = get(semester, "[0].semester");
  const date = get(semester, "[0].examinationDate");
  return (
    <div className="col-6 my-4" key={semesterId}>
      <div className="row m-0 mb-2">
        <div style={{ fontWeight: 700 }}>DATE OF EXAM: {formatDate(date)}</div>
        <div className="ml-auto" style={{ fontWeight: 700 }}>
          SEMESTER OF EXAM: {sem}
        </div>
      </div>
      <table style={fullWidthStyle}>
        <tbody>
          <tr>
            <th>MODULE</th>
            <th>CREDIT UNIT</th>
            <th>GRADE</th>
          </tr>
          {subjectRows}
        </tbody>
      </table>
    </div>
  );
};

const renderHeader = certificate => {
  const serial = get(certificate, "id");
  return (
    <div className="row">
      <div className="col-4">
        <img
          style={fullWidthStyle}
          src="data:image/png;base64,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"
        />
      </div>
      <div className="col-4" />
      <div className="col-4">
        <div style={{ color: "navy", fontWeight: 500 }}>
          TRANSCRIPT OF ACADEMIC RECORD
        </div>
        <div className="mt-3">SERIAL No. : {serial}</div>
      </div>
    </div>
  );
};

const renderGradingSystem = () => (
  <div className="row">
    <div className="col-6" />
    <div className="col-6 border" style={{ fontSize: "0.6rem" }}>
      <div className="text-center">
        <u>GRADING SYSTEM</u>
      </div>
      <div className="text-center" style={{ fontSize: "0.5rem" }}>
        (EFFECTIVE FOR JULY 2001 INTAKE)
      </div>
      <div className="row">
        <div className="col">
          <table>
            <tbody>
              <tr>
                <th>GRADE</th>
                <th>GRADE POINT</th>
                <th>MARKS</th>
                <th>DESCRIPTION</th>
              </tr>
              <tr>
                <td>AD*</td>
                <td>4.0</td>
                <td>80 - 100%</td>
                <td>DISTINCTION</td>
              </tr>
              <tr>
                <td>A+</td>
                <td>4.0</td>
                <td>85 - 100%</td>
                <td>EXCELLENT</td>
              </tr>
              <tr>
                <td>A</td>
                <td>4.0</td>
                <td>80 - 84%</td>
                <td>EXCELLENT</td>
              </tr>
              <tr>
                <td>B+</td>
                <td>3.5</td>
                <td>75 - 79%</td>
                <td>VERY GOOD</td>
              </tr>
              <tr>
                <td>B</td>
                <td>3.0</td>
                <td>70 - 74%</td>
                <td>VERY GOOD</td>
              </tr>
              <tr>
                <td>C+</td>
                <td>2.5</td>
                <td>65 - 69%</td>
                <td>GOOD</td>
              </tr>
              <tr>
                <td>C</td>
                <td>2.0</td>
                <td>60 - 64%</td>
                <td>GOOD</td>
              </tr>
              <tr>
                <td>D+</td>
                <td>1.5</td>
                <td>55 - 59%</td>
                <td>PASS</td>
              </tr>
              <tr>
                <td>D</td>
                <td>1.0</td>
                <td>50 - 54%</td>
                <td>PASS</td>
              </tr>
              <tr>
                <td>F</td>
                <td>4.0</td>
                <td>0 - 49%</td>
                <td>FAIL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col">
          <table>
            <tbody>
              <tr>
                <th>GRADE</th>
                <th>DESCRIPTION</th>
              </tr>
              <tr>
                <td>PX</td>
                <td>PASS IN MODULES GRADED PASS OR FAIL ONLY</td>
              </tr>
              <tr>
                <td>P</td>
                <td>PASS IN SUPPLEMENTARY EXAMINATION</td>
              </tr>
              <tr>
                <td>ABS</td>
                <td>ABSENT</td>
              </tr>
              <tr>
                <td>DB</td>
                <td>DEBARRED</td>
              </tr>
              <tr>
                <td>EX</td>
                <td>CREDIT EXEMPTION</td>
              </tr>
              <tr>
                <td>TRF</td>
                <td>CREDIT TRANSFER</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>* DISTINCTION GRADE IS AWARDED TO THE TOP 5% COHORT</div>
    </div>
  </div>
);

const renderTranscript = certificate => {
  // Group all modules by semesters
  const transcript = get(certificate, "transcript");
  const groupedSubjects = groupBy(transcript, "semester");
  const renderedSemesters = Object.keys(groupedSubjects).map(semester =>
    renderSemester(groupedSubjects[semester], semester)
  );

  return <div className="row">{renderedSemesters}</div>;
};

const renderStudentInfo = certificate => (
  <div className="row">
    <div className="col">
      <div className="row">
        <div className="col-4">Name:</div>
        <div className="col-8">{certificate.recipient.name}</div>
      </div>
      <div className="row">
        <div className="col-4">NRIC/FIN:</div>
        <div className="col-8">{certificate.recipient.did}</div>
      </div>
      <div className="row">
        <div className="col-4">STUDENT No:</div>
        <div className="col-8">{certificate.additionalData.studentId}</div>
      </div>
    </div>
    <div className="col">
      <div className="row">
        <div className="col-4">DATE OF ADMISSION:</div>
        <div className="col-8">{formatDate(certificate.admissionDate)}</div>
      </div>
      <div className="row">
        <div className="col-4">DATE OF GRADUATION:</div>
        <div className="col-8">{formatDate(certificate.graduationDate)}</div>
      </div>
      <div className="row">
        <div className="col-4">COURSE:</div>
        <div className="col-8">{certificate.name}</div>
      </div>
    </div>
  </div>
);

const renderNpfa = certificate => {
  const npfa = get(certificate, "additionalData.npfa", undefined);
  return npfa ? (
    <div className="row">National Physical Fitness Award: {npfa}</div>
  ) : null;
};

const renderFinalStatement = certificate => {
  const course = get(certificate.name);
  return (
    <div className="row">
      The student has completed the full-time course in {course}.
    </div>
  );
};

const Template = certificate => (
  <div className="container" style={{ fontSize: "0.9rem" }}>
    {renderHeader(certificate)}
    {renderGradingSystem()}
    <hr />
    {renderStudentInfo(certificate)}
    <hr />
    {renderTranscript(certificate)}
    {renderNpfa(certificate)}
    {renderFinalStatement(certificate)}
  </div>
);

export default Template;
