<%@ page language="java" contentType="text/html; charset=UTF-8"
	isELIgnored = "false"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
	<title>Chat</title>
</head>
<body>
<form action="<c:url value='/chat'/>">
	<table>
		<tr>
			<td><h1>Test Chat</h1></td>
		</tr>
		<c:forEach var="chat" items="${chat}">
			<tr>
				<td>${chat}</td>
			</tr>
		</c:forEach>
	</table>
	<input type="text" name="message">
	<input type="submit" value="send">
</form>
<form action="<c:url value='/chart'/>">
	<select name = "area1">
		<c:forEach var="list1" items = "${area1}">
			<c:if test="${selected1==list1}">
			<option value="${list1}" selected>${list1}</option>
			</c:if>
			<c:if test="${selected1!=list1}">
			<option value="${list1}">${list1}</option>
			</c:if>
		</c:forEach>
	</select>
	<select name= "area2">
		<c:forEach var="list2" items = "${area2}">
			<c:if test="${selected2==list2}">
			<option value="${list2}" selected>${list2}</option>
			</c:if>
			<c:if test="${selected2!=list2}">
			<option value="${list2}">${list2}</option>
			</c:if>
		</c:forEach>
	</select>
	<input type="submit" value="찾기">
</form>
</body>
</html>
