
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل درجات الطلاب</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: center;
        }
        table {
            margin: 20px auto;
            border-collapse: collapse;
            width: 80%;
        }
        th, td {
            border: 1px solid #000;
            padding: 10px;
        }
        th {
            background-color: #f4f4f4;
        }
        input[type="text"], input[type="number"] {
            margin: 10px;
            padding: 5px;
        }
        button {
            padding: 10px 20px;
            background-color: #28a745;
            color: #fff;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <h1>تسجيل درجات الطلاب</h1>
    <form id="gradesForm">
        <input type="text" id="studentName" placeholder="اسم الطالب" required>
        <input type="number" id="studentGrade" placeholder="درجة الطالب" required>
        <button type="button" onclick="addGrade()">إضافة الدرجة</button>
    </form>
    <table>
        <thead>
            <tr>
                <th>اسم الطالب</th>
                <th>الدرجة</th>
            </tr>
        </thead>
        <tbody id="gradesTable">
            <!-- البيانات ستُضاف هنا -->
        </tbody>
    </table>
    <script>
        function addGrade() {
            const name = document.getElementById('studentName').value;
            const grade = document.getElementById('studentGrade').value;

            if (name && grade) {
                const table = document.getElementById('gradesTable');
                const row = table.insertRow();
                const nameCell = row.insertCell(0);
                const gradeCell = row.insertCell(1);

                nameCell.textContent = name;
                gradeCell.textContent = grade;

                // إعادة تعيين الحقول
                document.getElementById('studentName').value = '';
                document.getElementById('studentGrade').value = '';
            } else {
                alert('يرجى إدخال اسم الطالب والدرجة.');
            }
        }
    </script>