func(ids []string) ([]*models.$modelName, []error) {
	placeholders := make([]string, len(ids))
	args := make([]interface{}, len(ids))
	for i := 0; i < len(ids); i++ {
		placeholders[i] = "?"
		args[i] = i
	}

table, _ := db.GetTable("$tableName")
valueById := map[string]*models.$modelName{}

for _, key := range ids {
	result, err := table.Get(key, false)
	data := result.GetValue()

	var value models.$modelName
	json.Unmarshal(data, &value)
	if err != nil {
		panic(err)
	}
	valueById[*value.ID] = &value
}
values := make([]*models.$modelName, len(ids))
for i, id := range ids {
	values[i] = valueById[id]
}
return values, nil
}/////////SPLIT
// // //BySlice
// func(ids [][]string) ([][]*models.$entityName, []error) {
// 	placeholders := make([]string, len(ids))
//   idSet := make(map[string]interface{})//make set
//   //value set
// 	args := make([][]interface{}, len(ids))
// 	for i := 0; i < len(ids); i++ {
// 		placeholders[i] = "?"
// 		args[i] = i
// 	}
//
// table, _ := db.GetTable("$entityNames")
// valueById := map[string]*models.$entityName{}
// //idSet
// for _, key := range idSet {
// 	result, err := table.Get(key, false)
// 	data := result.GetValue()
//
// 	var value models.$entityName
// 	json.Unmarshal(data, &value)
// 	if err != nil {
// 		panic(err)
// 	}
// 	valueById[*value.ID] = &value
// }
// values lists
// values := make([]*models.$entityName, len(ids))
// for i, id := range ids {
// 	for string
// 	values[i] = valueById[id]
// }
//
// return valuesLists, nil
// }
