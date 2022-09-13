from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.graphics import Rectangle, Color
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.clock import Clock
import kivy

kivy.require("1.9.1")

#
# class LoginWindow(FloatLayout):
#     def __init__(self, **kwargs):
#         super(LoginWindow, self).__init__(**kwargs)
#         self.glayout.rows = 3


class FridrichMessenger(App):
    title = "Fridrich Messenger"
    user_inp: TextInput

    def on_pause(self) -> bool:
        return True

    def build(self):
        layout = GridLayout(cols=1)

        layout.add_widget(Label(
            text="Username"
        ))
        self.user_inp = TextInput(
            text="",
            font_size=50,
            size_hint_y=None,
            height=80,
            pos=(0, 0)
        )
        layout.add_widget(self.user_inp)
        layout.add_widget(Label(
            text="Password"
        ))
        self.pwd_inp = TextInput(
            text="",
            font_size=50,
            size_hint_y=None,
            size_hint_x=.1,
            height=80,
            pos=(0, 0)
        )
        layout.add_widget(self.pwd_inp)

        return layout


if __name__ in ('__main__', '__android__'):
    FridrichMessenger().run()
