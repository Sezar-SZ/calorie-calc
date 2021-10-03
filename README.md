## Calorie Calc

**Calorie-Calc** is a native mobile app that helps you to easily track your daily intake calories and your workouts!

## How it works

The App doesn't have an initialized value for each food. But instead, by using key-value storage, each food and its calorie is saved after entering by the user. It means the user should add the food's calorie for the first time but after that, he can easily search for the value rather than entering it manually.

Other fun features available for users:

* There is a diagram at the top of the screen that visualizes the remaining and taken calories.
* The default daily calorie is 2000, but by clicking the diagram, user can change the default value.
* By long-pressing an item in the list, user can change the food name, calorie and also can remove the item from the list.


## Development 

This project is powered by [react-native](https://reactnative.dev/) and [Expo](https://expo.dev/).

For saving key-values, [react-native async-storage](https://github.com/react-native-async-storage/async-storage) is used.
