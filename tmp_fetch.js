(async () => {
  const res = await fetch("http://127.0.0.1:3001/api/generate/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-google-api-key": "TESTKEY",
    },
    body: JSON.stringify({
      topic: "Bánh trung thu",
      projectId: "123",
      characterId: "male_chef",
      characterType: "Nam",
      mainCharacter: "abc",
      locationContext: "Tại cửa hàng",
      videoGenre: "Giới thiệu món ăn",
      numScenes: "2 cảnh",
      duration: "10",
    }),
  });
  const text = await res.text();
  console.log("STATUS", res.status);
  console.log("HEADERS", Object.fromEntries(res.headers));
  console.log("BODY:\n", text);
})();
